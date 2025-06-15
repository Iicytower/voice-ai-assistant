import { Injectable, OnModuleInit } from '@nestjs/common';
import weaviate, { WeaviateClient } from 'weaviate-ts-client';
import { KnowledgeEntryMetadata } from '@libs/common';

export type CreateEntryRequest = {
  content: string;
  metadata: KnowledgeEntryMetadata;
};

export type UpdateEntryRequest = {
  id: string;
  content?: string;
  metadata?: KnowledgeEntryMetadata;
};

@Injectable()
export class WeaviateService implements OnModuleInit {
  private client: WeaviateClient;
  private readonly className = 'Knowledge';

  constructor() {
    this.client = weaviate.client({
      scheme: process.env.WEAVIATE_SCHEME || 'http',
      host: process.env.WEAVIATE_HOST || 'localhost:8080',
    });
  }

  async onModuleInit() {
    await this.createSchemaIfNotExists();
  }

  private async createSchemaIfNotExists() {
    const schema = await this.client.schema.getter().do();
    const classExists = schema.classes?.some(c => c.class === this.className);

    if (!classExists) {
      await this.client.schema
        .classCreator()
        .withClass({
          class: this.className,
          description: 'Knowledge base entries',
          vectorizer: 'text2vec-transformers',
          moduleConfig: {
            'text2vec-transformers': {
              vectorizeClassName: false,
            },
          },
          properties: [
            {
              name: 'content',
              dataType: ['text'],
              description: 'The content of the knowledge entry',
            },
            {
              name: 'title',
              dataType: ['text'],
              description: 'The title of the knowledge entry',
            },

            {
              name: 'author',
              dataType: ['text'],
              description: 'Author of the knowledge entry',
            },
            {
              name: 'category',
              dataType: ['text'],
              description: 'Category of the knowledge entry',
            },
            {
              name: 'tags',
              dataType: ['text[]'],
              description: 'Tags associated with the knowledge entry',
            },
            {
              name: 'createdAt',
              dataType: ['date'],
              description: 'Creation timestamp',
            },
            {
              name: 'updatedAt',
              dataType: ['date'],
              description: 'Last update timestamp',
            },
          ],
        })
        .do();
    }
  }

  async addEntry(request: CreateEntryRequest) {
    const { content, metadata } = request;

    const properties: Record<string, any> = {
      content,
      title: metadata.title || '',
      author: metadata.author || null,
      category: metadata.category || null,
      tags: metadata.tags || [],
      createdAt: metadata.createdAt || new Date().toISOString(),
      updatedAt: metadata.updatedAt || new Date().toISOString(),
    };

    const result = await this.client.data
      .creator()
      .withClassName(this.className)
      .withProperties(properties)
      .do();

    return result;
  }

  async searchSimilar(
    query: string,
    limit = isNaN(Number(process.env.WEAVIATE_LIMIT)) ? Number(process.env.WEAVIATE_LIMIT) : 20,
    metadataFilter?: Partial<KnowledgeEntryMetadata>,
  ) {
    const expandedQuery = [query, ...Object.values(metadataFilter)].join(' ');

    let graphqlQuery = this.client.graphql
      .get()
      .withClassName(this.className)
      .withFields('content title author category tags createdAt updatedAt')
      .withNearText({ concepts: [expandedQuery] })
      .withLimit(limit);

    // Apply metadata filters if provided
    if (metadataFilter && Object.keys(metadataFilter).length > 0) {
      const whereClause: any = {};

      if (metadataFilter.author) {
        whereClause.operator = 'Equal';
        whereClause.path = ['author'];
        whereClause.valueString = metadataFilter.author;
      }

      if (metadataFilter.category) {
        whereClause.operator = 'Equal';
        whereClause.path = ['category'];
        whereClause.valueString = metadataFilter.category;
      }

      if (metadataFilter.tags && metadataFilter.tags.length > 0) {
        whereClause.operator = 'ContainsAny';
        whereClause.path = ['tags'];
        whereClause.valueText = metadataFilter.tags;
      }

      if (Object.keys(whereClause).length > 0) {
        graphqlQuery = graphqlQuery.withWhere(whereClause);
      }
    }

    const result = await graphqlQuery.do();
    const entries = result.data.Get[this.className];

    return entries;
  }

  async deleteEntry(id: string) {
    await this.client.data.deleter().withClassName(this.className).withId(id).do();
  }

  async updateEntry(request: UpdateEntryRequest) {
    const { id, content, metadata } = request;
    const properties: Record<string, any> = {};

    if (content) properties.content = content;

    if (metadata) {
      if (metadata.author !== undefined) properties.author = metadata.author;
      if (metadata.category !== undefined) properties.category = metadata.category;
      if (metadata.tags !== undefined) properties.tags = metadata.tags;
      properties.updatedAt = new Date().toISOString();
    }

    await this.client.data
      .updater()
      .withClassName(this.className)
      .withId(id)
      .withProperties(properties)
      .do();
  }

  async getEntry(id: string) {
    const result = await this.client.data
      .getterById()
      .withClassName(this.className)
      .withId(id)
      .do();

    if (!result) return null;

    return result;
  }

  async searchByMetadata(metadataFilter: Partial<KnowledgeEntryMetadata>, limit = 20) {
    const whereClause: any = {};

    if (metadataFilter.author) {
      whereClause.operator = 'Equal';
      whereClause.path = ['author'];
      whereClause.valueString = metadataFilter.author;
    }

    if (metadataFilter.category) {
      whereClause.operator = 'Equal';
      whereClause.path = ['category'];
      whereClause.valueString = metadataFilter.category;
    }

    if (metadataFilter.tags && metadataFilter.tags.length > 0) {
      whereClause.operator = 'ContainsAny';
      whereClause.path = ['tags'];
      whereClause.valueText = metadataFilter.tags;
    }

    const result = await this.client.graphql
      .get()
      .withClassName(this.className)
      .withFields(
        'content title source author category tags createdAt updatedAt _additional { certainty }',
      )
      .withWhere(whereClause)
      .withLimit(limit)
      .do();

    const entries = result.data.Get[this.className];

    return entries;
  }
}

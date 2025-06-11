import { Injectable, OnModuleInit } from '@nestjs/common';
import weaviate, { WeaviateClient } from 'weaviate-ts-client';

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
          ],
        })
        .do();
    }
  }

  async addEntry(title: string, content: string) {
    const result = await this.client.data
      .creator()
      .withClassName(this.className)
      .withProperties({
        title,
        content,
      })
      .do();

    return result;
  }

  async searchSimilar(
    query: string,
    limit = isNaN(Number(process.env.WEAVIATE_LIMIT)) ? Number(process.env.WEAVIATE_LIMIT) : 20,
  ) {
    const result = await this.client.graphql
      .get()
      .withClassName(this.className)
      .withFields('content _additional { certainty }')
      .withNearText({ concepts: [query] })
      .withLimit(limit)
      .do();

    return result.data.Get[this.className];
  }

  async deleteEntry(id: string) {
    await this.client.data.deleter().withClassName(this.className).withId(id).do();
  }

  async updateEntry(id: string, content?: string) {
    const properties: Record<string, any> = {};
    if (content) properties.content = content;

    await this.client.data
      .updater()
      .withClassName(this.className)
      .withId(id)
      .withProperties(properties)
      .do();
  }
}

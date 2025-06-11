import { EVENT_HANDLER, MESSAGE_HANDLER } from './messageBus.constants';
import { EventPattern, MessagePattern } from './messageBus.types';

export function OnMessage(pattern: MessagePattern): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(MESSAGE_HANDLER, pattern, target, propertyKey);
  };
}

export function OnEvent(pattern: EventPattern): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(EVENT_HANDLER, pattern, target, propertyKey);
  };
}

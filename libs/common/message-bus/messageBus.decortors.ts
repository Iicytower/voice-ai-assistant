import { EventPattern, MessagePattern } from './comunication';
import { EVENT_HANDLER, MESSAGE_HANDLER } from './messageBus.constants';

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

import { Schema, MapSchema, type } from '@colyseus/schema';

// @colyseus/schema 3.0.76 requires the @type() decorator API (not defineTypes())
// for the getter/setter descriptors + $childType to be wired up correctly.
// tsconfig has experimentalDecorators:true and target ES2017 (so
// useDefineForClassFields is false and field initializers run through setters).

export class Player extends Schema {
  @type('string') sessionId = '';
  @type('string') name = '';
  @type('string') role = '';
  @type('number') x = 0;
  @type('number') y = 0;
  @type('number') z = 0;
  @type('number') rotY = 0;
  @type('string') color = '';
  @type('boolean') isCaught = false;
}

export class GameRoomState extends Schema {
  @type('string') phase = 'prep';
  @type({ map: Player }) players = new MapSchema<Player>();
}

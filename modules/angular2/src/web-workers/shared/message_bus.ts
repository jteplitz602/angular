export interface MessageBus{
  sink: MessageBusSink;
  source: MessageBusSource;
}

export interface SourceListener{
  (data: Object): void; // TODO: Replace this Object type with the type of a real messaging protocol
}

export interface MessageBusSource{
  listen(fn: SourceListener): void;
}

export interface MessageBusSink{
  send(message: Object): void;
}

export const Component = {
  RestApplication: Symbol('RestApplication'),
  Logger: Symbol('Logger'),
  Config: Symbol('Config'),
  DatabaseClient: Symbol('DatabaseClient'),

  UserService: Symbol('UserService'),
  UserModel: Symbol('UserModel'),

  OfferService: Symbol('OfferService'),
  OfferModel: Symbol('OfferModel'),

  CommentService: Symbol('CommentService'),
  CommentModel: Symbol('CommentModel'),

  ExceptionFilter: Symbol('ExceptionFilter'),

  UserController: Symbol('UserController'),
} as const;

export const Component = {
  RestApplication: Symbol(),
  Logger: Symbol(),
  Config: Symbol(),
  DatabaseClient: Symbol(),

  UserService: Symbol(),
  UserModel: Symbol(),

  OfferService: Symbol(),
  OfferModel: Symbol(),

  CommentService: Symbol(),
  CommentModel: Symbol(),

  ExceptionFilter: Symbol(),

  UserController: Symbol(),
  OfferController: Symbol(),
  CommentController: Symbol(),

  AuthService: Symbol(),
  AuthExceptionFilter: Symbol(),
} as const;

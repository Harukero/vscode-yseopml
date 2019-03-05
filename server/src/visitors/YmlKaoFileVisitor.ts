import { YmlBaseVisitor } from "./YmlBaseVisitor";

import { YmlCompletionItemsProvider } from "../completion/YmlCompletionItemsProvider";
import { YmlDefinitionProvider } from "../definitions";
import { ClassDeclarationContext, CompleteContext } from "../grammar";
import {
  ExternDeclarationContext,
  FunctionContext,
  StaticDeclarationContext,
  YenumContext,
} from "../grammar";
import { YmlClassVisitor } from "./YmlClassVisitor";
import { YmlFunctionVisitor } from "./YmlFunctionVisitor";
import { YmlObjectInstanceVisitor } from "./YmlObjectInstanceVisitor";

export class YmlKaoFileVisitor extends YmlBaseVisitor {
  constructor(
    completionProvider: YmlCompletionItemsProvider,
    uri: string,
    public definitions: YmlDefinitionProvider,
  ) {
    super(completionProvider, uri);
  }

  public visitStaticDeclaration(node: StaticDeclarationContext): void {
    const visitor = new YmlObjectInstanceVisitor(
      this.completionProvider,
      this.uri,
      this.definitions,
    );
    visitor.visit(node);
  }

  public visitClassDeclaration(node: ClassDeclarationContext): void {
    const visitor = new YmlClassVisitor(
      this.completionProvider,
      this.uri,
      this.definitions,
    );
    visitor.visit(node);
  }

  public visitCompletion(node: CompleteContext): void {
    // not implemented yet
  }

  public visitFunction(node: FunctionContext): void {
    const visitor = new YmlFunctionVisitor(
      this.completionProvider,
      this.uri,
      this.definitions,
    );
    visitor.visit(node);
  }

  public visitYenum(node: YenumContext): void {
    // not implemented yet
  }

  public visitExternDeclaration(node: ExternDeclarationContext): void {
    // not implemented yet
  }
}
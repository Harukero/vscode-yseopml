import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { YmlCompletionItemsProvider } from "../completion/YmlCompletionItemsProvider";
import { YmlDefinitionProvider } from "../definitions/YmlDefinitionProvider";
import { YmlVisitor } from "../grammar/YmlVisitor";

export default class YmlBaseVisitor extends AbstractParseTreeVisitor<void>
  implements YmlVisitor<void> {
  constructor(
    public completionProvider: YmlCompletionItemsProvider,
    public uri: string,
    public definitions?: YmlDefinitionProvider,
  ) {
    super();
  }

  public defaultResult() {
    // no default
  }
}

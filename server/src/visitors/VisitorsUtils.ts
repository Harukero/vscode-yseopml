import { Token } from "antlr4ts";
import {
  CompletionItemKind,
} from "vscode-languageserver";
import { YmlCompletionItemsProvider } from "../completion/YmlCompletionItemsProvider";
import { IDefinitionLocation } from "../definitions";
import { FieldContext, YmlIdContext } from "../grammar";
import { connection } from "../server";

const BEGINNING_QUOTES_REGEX = /^("""|")\s*/;
const ENDING_QUOTES_REGEX = /\s*("""|")$/;

export function getDocumentation(fieldOptions: FieldContext[]): string {
  try {
    for (const element of fieldOptions.filter((elem) => !!elem.commonField)) {
      const option = element.commonField();
      if (option != null && option._optionName.text === "documentation") {
        let documentation = option._optionValues[0].text;
        if (documentation !== null && documentation !== undefined) {
          documentation = documentation.replace(BEGINNING_QUOTES_REGEX, "");
          documentation = documentation.replace(ENDING_QUOTES_REGEX, "");
          return documentation;
        }
      } else {
        // YML fields unrelated to documentation.
      }
    }
  } catch (err) {
    connection.console.error(err.message);
  }
  return "not documented";
}

export function createNewCompletionItem(
  uri: string,
  completionProvider: YmlCompletionItemsProvider,
  ymlId: string,
  fields: FieldContext[],
  kind: CompletionItemKind,
  sourceElementName?: string,
  baseType?: string,
  scopeStartOffset?: number,
  scopeEndOffset?: number,
) {
  sourceElementName = sourceElementName ? sourceElementName : "static";
  const documentation = getDocumentation(fields);
  const returnType = getType(fields, baseType);
  const elementId = `id_${sourceElementName}_${ymlId}`;
  const completionItem = completionProvider.getItem(elementId);
  if (completionItem) {
    completionItem.documentation = documentation;
    completionItem.detail = returnType;
  } else {
    completionProvider.addCompletionItem({
      completion: {
        data: elementId,
        detail: returnType,
        documentation,
        kind,
        label: ymlId,
      },
      scopeEndOffset,
      scopeStartOffset,
      uri,
    });
  }
}

export function getType(
  fieldOptions: FieldContext[],
  baseType?: string,
): string {
  let domains = baseType ? baseType : "Object";
  let domainsLevel2 = "";
  try {
    for (const element of fieldOptions.filter((elem) => !!elem.commonField)) {
      const option = element.commonField();
      if (!!option) {
        const optionName = option._optionName.text;
        if (optionName === "domains") {
          domains = option._optionValues[0].text;
        } else if (optionName === "domainsLevel2") {
          domainsLevel2 = ` − ${option._optionValues[0].text}`;
        } else {
          // YML fields unrelated to domains.
        }
      }
    }
  } catch (err) {
    connection.console.error(err.message);
  }
  return domains.concat(domainsLevel2);
}

export function createLocation(
  entityName: string,
  startToken: Token,
  endToken: Token,
  uri: string,
): IDefinitionLocation {
  return {
    entityName,
    location: {
      range: {
        end: {
          character: endToken.charPositionInLine,
          line: endToken.line,
        },
        start: {
          character: startToken.charPositionInLine,
          line: startToken.line - 1,
        },
      },
      uri,
    },
  };
}
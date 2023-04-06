import { BigNumberish } from "@ethersproject/bignumber";
import { defaultAbiCoder } from "@ethersproject/abi";
import { BaseBuildParams, BaseBuilder } from "../base";
import { Order } from "../../order";
import { BytesEmpty, s } from "../../../utils";

interface BuildParams extends BaseBuildParams {}

export class ContractWideBuilder extends BaseBuilder {
  public isValid(order: Order): boolean {
    try {
      const copyOrder = this.build({
        ...order.params,
      });

      if (!copyOrder) {
        return false;
      }

      if (copyOrder.hash() !== order.hash()) {
        return false;
      }
    } catch {
      return false;
    }

    return true;
  }

  public build(params: BuildParams) {
    // if (
    //   params.strategy &&
    //   ![
    //     Addresses.StrategyCollectionSale[this.chainId],
    //     Addresses.StrategyCollectionSaleDeprecated[this.chainId],
    //   ].includes(params.strategy.toLowerCase())
    // ) {
    //   throw new Error("Invalid strategy");
    // }

    // if (params.isOrderAsk) {
    //   throw new Error("Unsupported order side");
    // }

    this.defaultInitialize(params);

    return new Order(this.chainId, {
      kind: "contract-wide",
      signer: params.signer,
      collection: params.collection,
      price: s(params.price),
      itemIds: [],
      amounts: ["1"],
      strategyId: 1,
      currency: params.currency,
      quoteType: params.quoteType,
      collectionType: params.collectionType,

      startTime: params.startTime!,
      endTime: params.endTime!,
      additionalParameters: params.additionalParameters ?? BytesEmpty,

      globalNonce: params.globalNonce ? s(params.globalNonce) : "0",
      subsetNonce: params.subsetNonce ? s(params.subsetNonce) : "0",
      orderNonce: params.orderNonce ? s(params.orderNonce) : "0",

      v: params.v,
      r: params.r,
      s: params.s,
    });
  }

  public buildMatching(order: Order, recipient: string, data: { tokenId: BigNumberish }) {
    return {
      recipient,
      additionalParameters: defaultAbiCoder.encode(["uint256"], [data.tokenId]),
    };
  }
}

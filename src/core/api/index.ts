import { apiProvider, ApiProvider } from "./ApiProvider";
import type { IDataProvider } from "./DataProvider.interface";

export const dataProvider: IDataProvider = apiProvider;
export { apiProvider, ApiProvider };
export type { IDataProvider };

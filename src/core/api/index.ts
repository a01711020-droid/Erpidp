import { apiProvider, ApiProvider, ApiError } from "./ApiProvider";
import type { IDataProvider } from "./DataProvider.interface";

export const dataProvider: IDataProvider = apiProvider;
export { apiProvider, ApiProvider, ApiError };
export type { IDataProvider };

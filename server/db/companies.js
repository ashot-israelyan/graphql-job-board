import DataLoader from "dataloader";
import { connection } from "./connection.js";

const getCompanyTable = () => connection.table('company');

export function getCompany(id) {
  return getCompanyTable().first().where({ id });
}

export function createCompanyLoader() {
  return new DataLoader(async (ids) => {
    const companies = await getCompanyTable().select().whereIn('id', ids);
    return ids.map((id) => companies.find((company) => company.id === id));
  });
}

import { cellType, ColumnHeader, IColumnHeader, UserRow } from "../types/types";
import { getPosition } from "./positions";

type ServiceKeys = "ISSUE_CODE" | "ISSUE" | "SERVICE_TIME";
type Service = Record<ServiceKeys, cellType>;

export function processTable(table: cellType[][][]): UserRow[] {
  const [userHeader, ...userRows] = table[1];
  const usersTable = processRows(userHeader, userRows);
  const [serviceHeader, ...serviceRows] = table[0];
  const servicesTable = processRows(serviceHeader, serviceRows) as Service[];

  const mergedTable = mergeTables(usersTable, servicesTable);

  return mergedTable;
}

function mergeTables(users: UserRow[], services: Service[]): UserRow[] {
  const servicesMap: Record<string, Service> = {};

  services.forEach((service) => {
    servicesMap[service.ISSUE_CODE.v] = service;
  });

  const tableHeaders = Object.values(ColumnHeader);

  const usersData = users.map((user, rowIndex) => {
    const service = servicesMap[user.ISSUE_CODE.v];
    const userData = {
      ...user,
      // Create a deep copy of the service object using structuredClone
      ...(service ? structuredClone(service) : {}),
    } as UserRow;
    const computedPos = setPositions(userData, tableHeaders, rowIndex);
    return computedPos;
  });

  return usersData;
}

function processRows(header: cellType[], rows: cellType[][]): UserRow[] {
  const proccessedRows = rows.map((row) => {
    const item = {} as UserRow;
    header.forEach((key, index) => {
      item[key.v as IColumnHeader] = {
        v: row[index].v,
        f: "",
        pos: "",
      } as cellType;
    });
    return item;
  });
  return proccessedRows;
}

function setPositions(
  userData: UserRow,
  tableHeaders: IColumnHeader[],
  rowIndex: number
): UserRow {
  tableHeaders.forEach((header, index) => {
    const pos = getPosition(index, rowIndex + 1);
    if (!userData[header as IColumnHeader]) {
      userData[header as IColumnHeader] = {
        v: "",
        f: "",
        pos,
      } as cellType;
    } else {
      userData[header as IColumnHeader].pos = pos;
    }
  });
  return userData;
}

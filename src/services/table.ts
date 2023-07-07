import { metadata } from "@/app/layout";
import db from "@/lib/db";

export interface TableList {
  id: number;
  schema: string;
  name: string;
}

export interface Table {
  tableMetadata: {
    table_name: string;
    columns: { label: string; data_type: string }[];
  };
  data: {}[];
}

export interface TableRepository {
  findAllTables(): Promise<TableList[]>;
  findTableById(id: number): Promise<Table>;
}

class TableService {
  database: TableRepository;

  constructor(database: TableRepository) {
    this.database = database;
  }

  public async getTablesJsonById(id: number) {
    const table = await this.database.findTableById(id);
    const response = {
      metadata: table.tableMetadata,
      data: table.data,
    };
    return response;
  }

  public async getAllTablesListJson() {
    const data = await this.getAllTables();
    const metadata = this.generateTableListMetadata(data);
    return { metadata, data };
  }

  private async getAllTables(): Promise<TableList[]> {
    return await this.database.findAllTables();
  }

  private generateTableListMetadata(data: TableList[]) {
    const columns: { label: string; data_type: string }[] = [
      { label: "id", data_type: "string" },
      { label: "schema", data_type: "string" },
      { label: "name", data_type: "string" },
    ];
    const links = this.generateLinks(data);
    return { table_name: "All Tables", links: links, columns: columns };
  }

  private generateLinks(data: TableList[]) {
    return data.map((item) => {
      return {
        label: item.name,
        href: `/dashboard/${item.schema}/${item.id}`,
      };
    });
  }
}

const tableService = new TableService(db);
export default tableService;

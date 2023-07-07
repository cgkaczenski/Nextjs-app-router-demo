import db from "@/lib/db";

export interface TableList {
  id: number;
  schema: string;
  name: string;
}

export interface Table {
  tableMetadata: {
    id: number;
    table_name: string;
    columns: { label: string; data_type: string }[];
  };
  data: {}[];
}

export interface RowMap {
  [key: string]: { id: string; [key: string]: string | number | boolean };
}

export interface TableRepository {
  findAllTables(): Promise<TableList[]>;
  findTableById(id: number): Promise<Table>;
  updateRowsByMap(rowMap: RowMap): Promise<void>;
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

  public async updateRowsByMap(rows: RowMap): Promise<void> {
    try {
      await this.database.updateRowsByMap(rows);
    } catch (error) {
      throw new Error(`Failed to update users: ${error}`);
    }
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

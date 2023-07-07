import db from "@/lib/db";

export interface TableList {
  id: number;
  schema: string;
  name: string;
}

export interface TableRepository {
  findAllTables(): Promise<TableList[]>;
}

class TableService {
  database: TableRepository;

  constructor(database: TableRepository) {
    this.database = database;
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

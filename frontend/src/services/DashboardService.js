import { DataManager } from "./DataManager";

const API_URL = "https://jsonplaceholder.typicode.com";

const dashboardService = new DataManager(API_URL);

export default dashboardService;
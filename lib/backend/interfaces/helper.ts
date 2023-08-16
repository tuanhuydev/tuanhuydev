export interface StorageInterface {
	save(file: File, location: string): Promise<any>;
}

import {inject, provider, Injector} from '@samizdatjs/tiamat';
import {Collection, LocalDatabase} from '@samizdatjs/tashmetu';
import {FileSystem, FSStorageAdapter, FileConfig, DirectoryConfig} from './interfaces';
import {basename, dirname} from 'path';
import {Directory} from './directory';
import {File} from './file';

export function file(config: FileConfig) {
  return (injector: Injector): Collection => {
    return injector.get<FSCollectionManager>('tashmetu.FSCollectionManager')
      .createFileCollection(config);
  };
}

export function directory(config: DirectoryConfig) {
  return (injector: Injector): Collection => {
    return injector.get<FSCollectionManager>('tashmetu.FSCollectionManager')
      .createDirectoryCollection(config);
  };
}

@provider({
  for: 'tashmetu.FSCollectionManager',
  singleton: true
})
export class FSCollectionManager {
  private collections: {[name: string]: FSStorageAdapter} = {};
  private storing = '';

  public constructor(
    @inject('tiamat.Injector') private injector: Injector,
    @inject('tashmetu.LocalDatabase') private cache: LocalDatabase,
    @inject('tashmetu.FileSystem') private fs: FileSystem
  ) {
    fs.on('file-added', (path: string) => {
      this.update(path);
    });
    fs.on('file-changed', (path: string) => {
      this.update(path);
    });
  }

  public createDirectoryCollection(config: DirectoryConfig): Collection {
    let serializer = config.serializer(this.injector);
    let cache = this.cache.createCollection(config.path);

    this.collections[config.path] = new Directory(
      cache, serializer, this.fs, config);

    return cache;
  }

  public createFileCollection(config: FileConfig): Collection {
    let serializer = config.serializer(this.injector);
    let cache = this.cache.createCollection(config.path);

    this.collections[config.path] = new File(
      cache, serializer, this.fs, config);

    return cache;
  }

  private getCollection(path: string): FSStorageAdapter {
    if (path.indexOf('/') > 0) {
      return this.collections[basename(dirname(path))];
    } else {
      return this.collections[path];
    }
  }

  private update(path: string): void {
    if (this.storing !== path) {
      let col = this.getCollection(path);
      if (col) {
        col.update(path);
      }
    } else {
      this.storing = '';
    }
  }
}

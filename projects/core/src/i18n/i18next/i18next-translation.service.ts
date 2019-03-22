import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerConfig } from '../../config/server-config/server-config';
import { I18nextService } from './i18next.service';
import { TranslationService } from '../translation.service';

@Injectable()
export class I18nextTranslationService implements TranslationService {
  private readonly NON_BREAKING_SPACE = String.fromCharCode(160);

  constructor(
    private i18nextService: I18nextService,
    private config: ServerConfig
  ) {}

  exists(key: string, options: any = {}): boolean {
    return this.i18nextService.exists(key, options);
  }

  translate(
    key: string,
    options: any = {},
    whitespaceUntilLoaded: boolean = false
  ): Observable<string> {
    // If we've already loaded the namespace (or failed to load), we should immediately emit the value
    // (or the fallback value in case the key is missing).

    // Moreover, we SHOULD emit a value (or a fallback value) synchronously (not in a promise/setTimeout).
    // Otherwise, we the will trigger additional deferred change detection in a view that consumes the returned observable,
    // which together with `switchMap` operator may lead to an infinite loop.

    return new Observable<string>(subscriber => {
      if (this.i18nextService.exists(key, options)) {
        subscriber.next(this.i18nextService.t(key, options));
        subscriber.complete();
      } else {
        if (whitespaceUntilLoaded) {
          subscriber.next(this.NON_BREAKING_SPACE);
        }
        this.loadKeyNamespace(key, () => {
          if (!this.i18nextService.exists(key, options)) {
            this.reportMissingKey(key);
            subscriber.next(this.getFallbackValue(key));
            subscriber.complete();
          } else {
            subscriber.next(this.i18nextService.t(key, options));
            subscriber.complete();
          }
        });
      }
    });
  }

  loadNamespaces(namespaces: string | string[]): Promise<any> {
    return this.i18nextService.loadNamespaces(namespaces);
  }

  /**
   * Returns a fallback value in case when the given key is missing
   * @param key
   */
  protected getFallbackValue(key: string): string {
    return this.config.production ? this.NON_BREAKING_SPACE : `[${key}]`;
  }

  /**
   * Loads the namespace of the given key
   * @param key
   */
  private loadKeyNamespace(key: string, callback: Function) {
    const namespace = this.getKeyNamespace(key);
    if (namespace !== undefined) {
      this.i18nextService.loadNamespaces(namespace, callback);
    } else {
      this.reportMissingKeyNamespace(key);
      callback();
    }
  }

  private getKeyNamespace(key: string): string {
    // CAUTION - this assumes ':' as namespace separator
    return key.includes(':') ? key.split(':')[0] : undefined;
  }

  private reportMissingKey(key: string) {
    if (!this.config.production) {
      console.warn(`Translation key missing '${key}'`);
    }
  }

  private reportMissingKeyNamespace(key: string) {
    if (!this.config.production) {
      console.warn(
        `Translation key without namespace '${key}' - cannot load key's namespace.`
      );
    }
  }
}
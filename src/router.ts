import { next, NextFunction } from './next';
import { Request } from './request';
import { Response } from './response';

declare const jest: any;

// https://expressjs.com/en/4x/api.html#router
export class Router {
  public request: Request;
  public response: Response;
  public next: NextFunction;
  public all: any;
  public get: any;
  public param: any;
  public route: any;
  public use: any;
  public post: any;
  public put: any;
  public patch: any;
  public delete: any;

  constructor() {
    const handler = jest.fn((path: any, callback: any): void => {
      if (typeof path === 'string' && typeof callback === 'function') {
        callback(this.request, this.response, this.next);
      } else {
        path(this.request, this.response, this.next);
      }
    });

    this.request = new Request();
    this.response = new Response();
    this.next = next;
    this.param = jest.fn();
    this.all = jest.fn();
    this.use = jest.fn();
    this.get = handler;
    this.post = handler;
    this.put = handler;
    this.patch = handler;
    this.delete = handler;

    /**
     * @method route
     * @param path - the path or thing our route needs
     * @desc should expose and object containing pointers to each
     * HTTP method outlined above. (eg. get, put, post)
     * @note since we're returning another object to create a chain,
     * we have to be crafty with what 'this/that' means, in order to avoid
     * referring to myself, and triggering an inifinite recursion.
     */
    this.route = jest.fn((path: string) => {

      // return an object that proxies the other functions,
      // and returns a copy of me, not the Router
      return {
        delete: (cb: any) => {
          this.delete(path, cb);
          return this;
        },
        get: (cb: any) => {
          this.get(path, cb);
          return this;
        },
        patch: (cb: any) => {
          this.patch(path, cb);
          return this;
        },
        post: (cb: any) => {
          this.post(path, cb);
          return this;
        },
        put: (cb: any) => {
          this.put(path, cb);
          return this;
        },
      };
    });
    return this;
  }

  public resetMocked() {
    this.all.mockReset();
    this.get.mockReset();
    this.param.mockReset();
    this.route.mockReset();
    this.use.mockReset();
  }
}

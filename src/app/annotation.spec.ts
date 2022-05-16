import { TestBed, TestModuleMetadata, waitForAsync as realAsync } from '@angular/core/testing';
import {HttpRequest} from '@angular/common/http';
import 'reflect-metadata';

// tslint:disable-next-line:no-namespace
export namespace Spec {
  enum TestMethodType {
    After, Before, TestMethod
  }

  interface TestMethod {
    method: string;
    option: TestOption;
  }

  interface TestOption {
    type: TestMethodType;
    async: boolean;
    ignore: boolean;
  }

  interface MockInject {
    property: string;
    type: string;
  }

  function getTestMethods(prototype: any, type: TestMethodType): TestMethod[]  {
    const testMethodName = '$$' + type;

    if (!prototype[testMethodName]) {
      prototype[testMethodName] = [];
    }

    return prototype[testMethodName];
  }

  function addTestMethod(prototype: any, method: string, option: TestOption) {
    getTestMethods(prototype, option.type).push({ method, option });
  }

  function getMockInjects(prototype: any): MockInject[] {
    const mockInjectSymbol = '$$MOCK_INJECTS';

    if (!prototype[mockInjectSymbol]) {
      prototype[mockInjectSymbol] = [];
    }

    return prototype[mockInjectSymbol];
  }

  function addMockInject(prototype: any, property: string) {
    const type = Reflect.getMetadata('design:type', prototype, property);

    getMockInjects(prototype).push({ property, type });
  }

  export function matchUrl(url: string): ((req: HttpRequest<any>) => boolean) {
    return (req: HttpRequest<any>) => req.url === url;
  }

  export function Test(prototype: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addTestMethod(prototype, propertyKey, {
      async: false,
      type: TestMethodType.TestMethod,
      ignore: false
    });
  }

  export function AsyncTest(prototype: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addTestMethod(prototype, propertyKey, {
      async: true,
      type: TestMethodType.TestMethod,
      ignore: false
    });
  }

  export function Before(prototype: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addTestMethod(prototype, propertyKey, {
      async: false,
      type: TestMethodType.Before,
      ignore: false
    });
  }

  export function AsyncBefore(prototype: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addTestMethod(prototype, propertyKey, {
      async: true,
      type: TestMethodType.Before,
      ignore: false
    });
  }

  export function After(prototype: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addTestMethod(prototype, propertyKey, {
      async: false,
      type: TestMethodType.After,
      ignore: false
    });
  }

  export function AsyncAfter(prototype: any, propertyKey: string, descriptor: PropertyDescriptor) {
    addTestMethod(prototype, propertyKey, {
      async: true,
      type: TestMethodType.After,
      ignore: false
    });
  }

  export function InjectMock(prototype: any, propertyKey) {
    addMockInject(prototype, propertyKey);
  }

  export function Skip(prototype: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const testMethod = getTestMethods(prototype, TestMethodType.TestMethod).find(t => t.method === propertyKey);

    if (!testMethod) { return; }

    testMethod.option.ignore = true;
  }

  export function TestSuite(metadata?: TestModuleMetadata) {
    // tslint:disable-next-line:ban-types
    return (clazz: Function) => {
      const testSuiteName = clazz.prototype.constructor.name;

      describe(testSuiteName, () => {
        const testSuite = new clazz.prototype.constructor();

        const beforeMethods = getTestMethods(clazz.prototype, TestMethodType.Before);
        const testMethods = getTestMethods(clazz.prototype, TestMethodType.TestMethod);
        const afterMethods = getTestMethods(clazz.prototype, TestMethodType.After);
        const mockInjects = getMockInjects(clazz.prototype);

        if (metadata) {
          beforeEach(() => {
            TestBed.configureTestingModule(metadata);

            for (const mockInject of mockInjects) {
              testSuite[mockInject.property] = TestBed.get(mockInject.type);
            }
          });
        }

        for (const testMethod of beforeMethods) {
          if (testMethod.option.async) {
            beforeEach(realAsync(invoke(testSuite, testMethod.method)));
            continue;
          }

          beforeEach(invoke(testSuite, testMethod.method));
        }

        for (const testMethod of testMethods) {
          if (testMethod.option.ignore) {
            xit(testMethod.method, invoke(testSuite, testMethod.method));
            continue;
          }

          if (testMethod.option.async) {
            it(testMethod.method, realAsync(invoke(testSuite, testMethod.method)));
            continue;
          }

          it(testMethod.method, invoke(testSuite, testMethod.method));
        }

        for (const testMethod of afterMethods) {
          if (testMethod.option.async) {
            afterEach(realAsync(invoke(testSuite, testMethod.method)));
            continue;
          }

          afterEach(invoke(testSuite, testMethod.method));
        }
      });

      // tslint:disable-next-line:no-shadowed-variable
      function invoke(clazz: any, methodName: any) {
        return clazz[methodName].bind(clazz);
      }
    };
  }

}

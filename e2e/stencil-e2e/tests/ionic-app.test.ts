import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq
} from '@nrwl/nx-plugin/testing';
import { normalize } from 'path';
import { addPackageBeforeTest } from '../utils/testing';

describe('e2e-ionic-app', () => {
  let plugin: string;

  beforeEach(() => {
    plugin = uniq('ionic-app');
    ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
    addPackageBeforeTest("@nxtend/capacitor", "^1.0.0");
  });

  describe('stencil ionic app', () => {
    it(`should create ionic app with css`, async (done) => {
      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --style='css'`
      );

      expect(() => {
          checkFilesExist(
            normalize(`apps/${plugin}/stencil.config.ts`),
            normalize(`apps/${plugin}/tsconfig.json`),
            normalize(`apps/${plugin}/src/components/app-home/app-home.e2e.ts`),
            normalize(`apps/${plugin}/src/components/app-home/app-home.tsx`),
            normalize(`apps/${plugin}/src/components/app-home/app-home.css`),
            normalize(`apps/${plugin}/src/components/app-profile/app-profile.e2e.ts`),
            normalize(`apps/${plugin}/src/components/app-profile/app-profile.tsx`),
            normalize(`apps/${plugin}/src/components/app-profile/app-profile.spec.ts`),
            normalize(`apps/${plugin}/src/components/app-profile/app-profile.css`),
            normalize(`apps/${plugin}/src/components/app-root/app-root.e2e.ts`),
            normalize(`apps/${plugin}/src/components/app-root/app-root.tsx`),
            normalize(`apps/${plugin}/src/components/app-root/app-root.css`)
          );
      }).not.toThrow();

      done();
    });
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --directory subdir --style=css`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/stencil.config.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('stencil ionic app builder', () => {
    it(`should build ionic app`, async (done) => {
      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --style='css'`
      );

      const result = await runNxCommandAsync(`build ${plugin} --dev`);
      expect(result.stdout).toContain('build finished');

      done();
    });

    it('should add capacitor project', async (done) => {
      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --tags e2etag,e2ePackage --style=css`
      );

      expect(() => {
        checkFilesExist(
          `apps/${plugin}/src/components/app-root/app-root.tsx`,
          `apps/${plugin}/src/components/app-profile/app-profile.tsx`,
          `apps/${plugin}/src/components/app-home/app-home.tsx`,
          `apps/${plugin}/src/components/app-tabs/app-tabs.tsx`,

          `apps/${plugin}-cap/capacitor.config.json`
        );
      }).not.toThrow();

      done();
    });
  });
});

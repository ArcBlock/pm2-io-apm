import { expect } from 'chai';
import { canUseInspector } from '../src/constants';

describe('Constants', () => {
  describe('canUseInspector', () => {
    let originalEnv: NodeJS.ProcessEnv;
    let originalVersion: string;

    beforeEach(() => {
      // 保存原始环境变量
      originalEnv = { ...process.env };
      originalVersion = process.version;
    });

    afterEach(() => {
      // 恢复原始环境变量
      process.env = originalEnv;
      Object.defineProperty(process, 'version', {
        value: originalVersion
      });
    });

    it('should return false when PM2_IO_ENABLE is not true', () => {
      process.env.PM2_IO_ENABLE = 'false';
      expect(canUseInspector()).to.be.false;
    });

    it('should return true for Node.js version >= 10.1.0', () => {
      process.env.PM2_IO_ENABLE = 'true';
      Object.defineProperty(process, 'version', {
        value: 'v12.0.0'
      });
      expect(canUseInspector()).to.be.true;
    });

    it('should return true for Node.js 8.x with FORCE_INSPECTOR=1', () => {
      process.env.PM2_IO_ENABLE = 'true';
      process.env.FORCE_INSPECTOR = '1';
      Object.defineProperty(process, 'version', {
        value: 'v8.9.0'
      });
      expect(canUseInspector()).to.be.true;
    });

    it('should return true for Node.js 8.x in production environment', () => {
      process.env.PM2_IO_ENABLE = 'true';
      process.env.NODE_ENV = 'production';
      Object.defineProperty(process, 'version', {
        value: 'v8.9.0'
      });
      expect(canUseInspector()).to.be.true;
    });

    it('should return false for Node.js 8.x without special conditions', () => {
      process.env.PM2_IO_ENABLE = 'true';
      Object.defineProperty(process, 'version', {
        value: 'v8.9.0'
      });
      expect(canUseInspector()).to.be.false;
    });

    it('should return false for Node.js version < 8.0.0', () => {
      process.env.PM2_IO_ENABLE = 'true';
      Object.defineProperty(process, 'version', {
        value: 'v7.10.1'
      });
      expect(canUseInspector()).to.be.false;
    });

    it('should return false in Bun environment', () => {
      process.env.PM2_IO_ENABLE = 'true';
      // @ts-ignore: 模拟 Bun 环境
      global.Bun = {};
      expect(canUseInspector()).to.be.false;
      // @ts-ignore: 清理模拟
      delete global.Bun;
    });
  });
}); 
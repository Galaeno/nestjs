import { AuthGuard } from '../../../src/common/guards/auth.guards';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard()).toBeDefined();
  });
});

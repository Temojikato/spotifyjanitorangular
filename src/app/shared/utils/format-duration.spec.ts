import { formatDuration } from './format-duration';

describe('formatDuration', () => {
  it('should return "0:00" for 0 ms', () => {
    expect(formatDuration(0)).toEqual('0:00');
  });

  it('should format durations with seconds less than 10 with a leading zero', () => {
    expect(formatDuration(62000)).toEqual('1:02');
  });

  it('should format durations with seconds 10 or greater without additional padding', () => {
    expect(formatDuration(65000)).toEqual('1:05');
  });

  it('should handle exactly one minute', () => {
    expect(formatDuration(60000)).toEqual('1:00');
  });

  it('should correctly format longer durations', () => {
    expect(formatDuration(125000)).toEqual('2:05');
  });
});

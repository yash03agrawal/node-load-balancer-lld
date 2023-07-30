import LeastConnectionLoadBalancer from '../../src/loadBalancer/leastConnectionLoadBalancer';
import ILoadBalancer from '../../src/loadBalancer/loadBalancer';
import RoundRobinLoadBalancer from '../../src/loadBalancer/roundRobinLoadBalancer';
import LoadBalancerFactory from '../../src/loadBalancerFactory/loadBalancerFactory';

describe('LoadBalancerFactory', () => {
  const loadBalancerFactory: LoadBalancerFactory = new LoadBalancerFactory();

  test('should return round robin LB', () => {
    const loadBalancer: ILoadBalancer = loadBalancerFactory.getLoadBalancer('round-robin', 3);
    expect(loadBalancer).toBeInstanceOf(RoundRobinLoadBalancer);
  });

  test('should return least connection LB', () => {
    const loadBalancer: ILoadBalancer = loadBalancerFactory.getLoadBalancer('least-connection', 3);
    expect(loadBalancer).toBeInstanceOf(LeastConnectionLoadBalancer);
  });

  test('should return least connection LB', () => {
    const loadBalancer: ILoadBalancer = loadBalancerFactory.getLoadBalancer('', 3);
    expect(loadBalancer).toBeInstanceOf(LeastConnectionLoadBalancer);
  });
});

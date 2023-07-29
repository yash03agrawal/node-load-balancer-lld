import LeastConnectionLoadBalancer from '../loadBalancer/leastConnectionLoadBalancer';
import ILoadBalancer from '../loadBalancer/loadBalancer';
import RoundRobinLoadBalancer from '../loadBalancer/roundRobinLoadBalancer';

export default class LoadBalancerFactory {
  getLoadBalancer = (type: string, capacity: number): ILoadBalancer => {
    switch (type) {
      case 'least-connection':
        return new LeastConnectionLoadBalancer(capacity);
      case 'round-robin':
        return new RoundRobinLoadBalancer(capacity);
      default:
        return new LeastConnectionLoadBalancer(capacity);
    }
  };
}

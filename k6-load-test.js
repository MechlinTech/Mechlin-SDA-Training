import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '30s',
};

export default function () {
  const response = http.get('http://host.docker.internal:3000/health');

  check(response, {
    'health endpoint returns 200': (r) => r.status === 200,
  });

  sleep(1);
}
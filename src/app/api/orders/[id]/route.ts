import { createCollectionItemRoute } from '@/lib/collection-helpers';
import Order from '@/models/Order';

const { GET, PATCH, DELETE } = createCollectionItemRoute(Order);
export { GET, PATCH, DELETE };

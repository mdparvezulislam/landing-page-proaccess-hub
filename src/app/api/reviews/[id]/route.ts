import { createCollectionItemRoute } from '@/lib/collection-helpers';
import Review from '@/models/Review';

const { GET, PATCH, DELETE } = createCollectionItemRoute(Review);
export { GET, PATCH, DELETE };

import { createCollectionItemRoute } from '@/lib/collection-helpers';
import FAQ from '@/models/FAQ';

const { GET, PATCH, DELETE } = createCollectionItemRoute(FAQ);
export { GET, PATCH, DELETE };

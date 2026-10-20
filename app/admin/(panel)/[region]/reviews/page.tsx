import { SectionPage } from '../../section-page';
import { ReviewsEditor } from './reviews-editor';

export default function ReviewsPage({ params }: { params: Promise<{ region: string }> }) {
    return (
        <SectionPage
            params={params}
            render={(c, region) => (
                <ReviewsEditor
                    key={region}
                    region={region}
                    initial={c.reviews}
                />
            )}
        />
    );
}

import { SectionPage } from '../../section-page';
import { LocationEditor } from './location-editor';

export default function LocationPage({ params }: { params: Promise<{ region: string }> }) {
    return (
        <SectionPage
            params={params}
            render={(c, region) => (
                <LocationEditor
                    key={region}
                    region={region}
                    initial={c.location}
                />
            )}
        />
    );
}

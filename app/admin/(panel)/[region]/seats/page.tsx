import { SectionPage } from '../../section-page';
import { SeatsEditor } from './seats-editor';

export default function SeatsPage({ params }: { params: Promise<{ region: string }> }) {
    return (
        <SectionPage
            params={params}
            render={(c, region) => (
                <SeatsEditor
                    key={region}
                    region={region}
                    initial={c.seats}
                />
            )}
        />
    );
}

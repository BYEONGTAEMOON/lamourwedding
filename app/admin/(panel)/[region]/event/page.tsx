import { SectionPage } from '../../section-page';
import { EventEditor } from './event-editor';

export default function EventPage({ params }: { params: Promise<{ region: string }> }) {
    return (
        <SectionPage
            params={params}
            render={(c, region) => <EventEditor key={region} region={region} initial={c.event} />}
        />
    );
}

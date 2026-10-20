import { SectionPage } from '../../section-page';
import { TickerEditor } from './ticker-editor';

export default function TickerPage({ params }: { params: Promise<{ region: string }> }) {
    return (
        <SectionPage
            params={params}
            render={(c, region) => (
                <TickerEditor
                    key={region}
                    region={region}
                    initial={c.ticker}
                />
            )}
        />
    );
}

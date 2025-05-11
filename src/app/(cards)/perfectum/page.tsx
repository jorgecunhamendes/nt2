import { Cards } from "@/lib/ui/cards"

import perfectum from "@/data/perfectum.json"


export default function Page() {
    return (
        <main>
            <div>Perfectum</div>
            <Cards cards={perfectum} length={5} />
        </main>
    )
}

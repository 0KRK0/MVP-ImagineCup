import Link from 'next/link';
export default function Home(){
    return(
        <div>
            <div>
                <Link href='/Supervisor'>Supervisor</Link>
            </div>
            <div>
            <Link href='/Builder'>Builder </Link>
            </div>
        </div>
        
    )
}
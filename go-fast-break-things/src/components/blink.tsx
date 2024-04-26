import styles from "../styles/blink.module.css"

interface BlinkProps {
    text: string
}
const Blink = ({text}: BlinkProps) => {
    return (
        <>
        <pre className={`${styles.blink_me}`}>{text}</pre>
    </>
    )
}

export default Blink
import styles from "../styles/blink.module.css"

interface BlinkProps {
    text: string
}
const Blink = ({text}: BlinkProps) => {
    return (
        <>
        <span className={`${styles.blink_me}`}>{text}</span>
    </>
    )
}

export default Blink
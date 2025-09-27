// `Sync`에 대해서는 연습할 것이 많지 않으니, 그냥 기억해두세요.
fn outro() -> &'static str {
    "I have a good understanding of Send and Sync!"
}

#[cfg(test)]
mod tests {
    use crate::outro;

    #[test]
    fn test_outro() {
        assert_eq!(outro(), "I have a good understanding of Send and Sync!");
    }
}
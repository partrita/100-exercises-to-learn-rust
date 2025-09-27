fn intro() -> &'static str {
    // TODO: 여기를 수정하세요 👇
    "I'm ready to learn about futures!"
}

#[cfg(test)]
mod tests {
    use crate::intro;

    #[test]
    fn test_intro() {
        assert_eq!(intro(), "I'm ready to learn about futures!");
    }
}
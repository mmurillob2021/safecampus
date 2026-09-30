import XCTest

final class SafeCampusUITests: XCTestCase {

    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    func testLogin() throws {
        let app = XCUIApplication()
        app.launch()

        let window = app.windows.firstMatch
        XCTAssertTrue(window.waitForExistence(timeout: 10))

        // Coordinates below are normalized offsets within the login screen,
        // measured against the card layout since RN inputs carry no
        // accessibility identifiers yet.
        let emailField = window.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.505))
        let passwordField = window.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.596))
        let signInButton = window.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.675))

        emailField.tap()
        app.typeText("runcheck@safecampus.test")

        passwordField.tap()
        app.typeText("TestPass123!")
        app.typeText("\n") // blurOnSubmit dismisses the keyboard

        signInButton.tap()

        let homeTab = app.buttons["Home"]
        XCTAssertTrue(homeTab.waitForExistence(timeout: 15), "Expected Home tab to appear after login")
    }
}

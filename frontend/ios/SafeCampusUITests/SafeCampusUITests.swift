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

    /// Access pass flow: empty state → "Generar pase" → QR with countdown.
    /// Needs the backend running with the seed users.
    func testAccessPass() throws {
        let app = XCUIApplication()
        app.launch()

        let window = app.windows.firstMatch
        XCTAssertTrue(window.waitForExistence(timeout: 10))

        let email = app.textFields.firstMatch
        XCTAssertTrue(email.waitForExistence(timeout: 10))
        email.tap()
        XCTAssertTrue(app.keyboards.firstMatch.waitForExistence(timeout: 5))
        email.typeText("student@safecampus.dev")

        let password = app.secureTextFields.firstMatch
        password.tap()
        password.typeText("Test1234!\n")

        // The second "Iniciar sesión" text is the button label (the first is the heading).
        let signIn = app.staticTexts.matching(NSPredicate(format: "label == 'Iniciar sesión'")).element(boundBy: 1)
        XCTAssertTrue(signIn.waitForExistence(timeout: 5))
        signIn.tap()

        let accessTab = app.buttons.matching(NSPredicate(format: "label CONTAINS 'Acceso'")).firstMatch
        XCTAssertTrue(accessTab.waitForExistence(timeout: 15), "Expected Acceso tab after login")
        accessTab.tap()

        let generate = app.staticTexts["Generar pase"]
        XCTAssertTrue(generate.waitForExistence(timeout: 10), "Expected empty state with Generar pase")
        attachScreenshot(app, name: "access-empty")

        generate.tap()
        let valid = app.staticTexts.matching(NSPredicate(format: "label BEGINSWITH 'Vigente'")).firstMatch
        XCTAssertTrue(valid.waitForExistence(timeout: 10), "Expected QR with countdown")
        attachScreenshot(app, name: "access-active")
    }

    private func attachScreenshot(_ app: XCUIApplication, name: String) {
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}

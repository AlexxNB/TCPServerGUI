module.exports = test => test( 'Requests test' ,
  async(page,{ok,is,not}) => {

    const $link = await page.findByText(/#\d 127.0.0.1/,'a');
    ok( $link, 'Link to connection is exist' );

    await $link.click();
    await page.waitForTimeout(150); // fetching

    const $editorPane = await page.find('.editor.bt');
    ok( $editorPane, 'Editor Pane is exist' );

    const $sendButton = await $editorPane.findByText('Send','button');
    ok( $sendButton, 'Send button is exist' );

    const $byteInput = await $editorPane.find('td > input');
    ok( $byteInput, 'Input in editor is exist' );

    const $presetsPane = await page.find('.presets.bl');
    ok( $presetsPane, 'Presets Pane is exist' );

    const $addButton = await $presetsPane.findByText('Add preset','button');
    ok( $addButton, 'Send button is exist' );

    ok( await $presetsPane.findByText('No saved\npresets'), 'Presets list is empty' );

    ok( await $addButton.isDisabled(), '', 'Add button should be disabled' );

    await $byteInput.type('12');
    not(await $addButton.isDisabled(), 'Add button should not be disabled' );

    await $addButton.click();

    const $presetButton = await $presetsPane.findByText('Preset #1','button');
    ok( $presetButton, 'Preset button is exist' );

    const $editPane = await $presetsPane.find('.editpanel');
    ok( $editPane, 'Edit pane is opened' );

    const $titleInput = await $editPane.find('input');
    ok( $titleInput, 'Title input is exist' );

    const $saveButton = await $editPane.findByText('Save changes','button');
    ok( $saveButton, 'Save button is exist' );

    const $closeButton = await $editPane.findByText('Close','button');
    ok( $closeButton, 'Close button is exist' );

    await $titleInput.type('23');
    is( await $titleInput.getValue(), 'Preset #123', 'Title changed in input' );
    is( await $presetButton.getText(), 'Preset #123', 'Title changed in button' );

    ok(await $saveButton.isDisabled(), 'Save button should be disabled' );

    await $byteInput.click({clickCount:2});
    await $byteInput.type('AB');
    not(await $saveButton.isDisabled(), 'Save button should not be disabled' );

    await $saveButton.click();
    await $closeButton.click();
    await $sendButton.click();
    await page.waitForTimeout(150); //fetching

    not( await $presetsPane.find('.editpanel'), 'Edit panel should be hidden' );
    is( await $byteInput.getValue(), '', 'Editor should be empty' );

    await $presetButton.click();

    const $editPane2 = await $presetsPane.find('.editpanel');
    ok( $editPane2, 'Edit pane is opened again' );
    is( await $byteInput.getValue(), 'AB', 'First byte should be "AB"' );

    const $deleteButton = await $editPane2.findByText('Delete','button');
    ok( $deleteButton, 'Delete button is exist' );

    await $deleteButton.click();
    not( await $presetsPane.find('.editpanel'), 'Edit panel should be hidden' );
    ok( await $presetsPane.findByText('No saved\npresets'), 'Presets list is empty' );
  }
);
import { delay } from "jsr:@std/async@0.224.2";
import "../WebGen/assets/font/font.css";
import { TextInput } from "../WebGen/components/form/input.ts";
import { appendBody, DateTimeInput, DialogContainer, MaterialIcon, PrimaryButton, Sheets, Spinner, Table, TextAreaInput, TextButton, WebGenTheme, type CheckboxValue } from "../WebGen/components/mod.ts";
import { SheetHeader } from "../WebGen/components/stacking/sheetHeader.ts";
import { asRef, Content, css, Grid, Label, ref } from "../WebGen/core/mod.ts";
import { createStableRequest } from "../WebGen/extended/mod.ts";
import { Game } from "./types.ts";

const list = asRef<Game[]>([]);

async function fetchGameList() {
    try {
        buttonDisabled.value = true;
        const response = await createStableRequest({
            request: new Request("http://localhost:8000/games"),
            failOnNetworkError: true,
            retryOnHttpError: true,
        });

        const [ data ] = await Promise.all([
            response.json(),
            delay(100)
        ]);
        list.value = data.list;
    } catch (error) {
        alert(error);
    } finally {
        buttonDisabled.value = false;
    }
}

const buttonDisabled = asRef(false);

fetchGameList();

const data = asRef("Hello World!");

const loremIpsum = `
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.

Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.

Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.

At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
`;

const sheets = Sheets();

sheets
    .setMinWidth("400px")
    .setWidth("100%");

const checkboxState = asRef<CheckboxValue>(false);

const blinking = asRef(false);

setInterval(() => blinking.value = !blinking.value, 500);

appendBody(
    WebGenTheme(
        DialogContainer(sheets.visible(), sheets)
            .setAttribute("no-overflow", "")
        ,
        Content(
            Label("CRUD Demo - Game list")
                .setFontWeight("bold")
                .setTextSize("4xl")
                .setMargin("50px 0 10px"),
            Grid(
                PrimaryButton(ref`Reload Game List`)
                    .setDisabled(buttonDisabled)
                    .addPrefix(MaterialIcon("refresh"))
                    .onPromiseClick(() => fetchGameList())
            )
                .setGap()
                .setAutoFlow("column")
                .setAutoColumn("max-content")
                .setAlignContent("center")
                .setMargin("5px 0 15px"),
            Grid(
                buttonDisabled.map((disabled) =>
                    disabled
                        ? Spinner()
                            .addStyle(css`
                                @keyframes fadeIn {
                                    0% {
                                        grid-template-rows: 0px;
                                    }
                                    50% {
                                        grid-template-rows: 0px;
                                    }
                                    to {
                                        grid-template-rows: calc(24px + 24px);
                                    }
                                }
                                :host {
                                    display: grid;
                                    place-items: center;
                                    grid-template-rows: calc(24px + 24px);
                                    overflow: hidden;
                                    animation: fadeIn 500ms ease;
                                }
                            `)
                        : []
                )
            )
                .setJustifyContent("center"),
            Table(
                list.map(games => games.map(game => ({
                    title: game.metadata.name,
                    ulid: game.metadata.ulid,
                    creationDate: game.metadata.creationDate,
                    lastModifiedDate: game.metadata.lastModifiedDate,
                    activePlayers: game.spec.players,
                }))),
                asRef({
                    title: {
                        titleRenderer: () => Label("Title"),
                        columnWidth: "auto"
                    },
                    ulid: {
                        titleRenderer: () => Label("ID"),
                    },
                    creationDate: {
                        titleRenderer: () => Label("Creation Date"),
                        cellRenderer: (value) => Label(new Date(value).toLocaleString())
                    },
                    lastModifiedDate: {
                        titleRenderer: () => Label("Last Modified Date"),
                        cellRenderer: (value) => Label(new Date(value).toLocaleString()),
                    }
                }))
                .onRowClick((rowIndex) => {
                    const game = list.value[ rowIndex ];
                    sheets.addSheet(
                        Grid(
                            SheetHeader(ref`${game.metadata.name}`, sheets),
                            Grid(
                                TextInput(asRef(game.metadata.name), "Name")
                                    .setInvalid(blinking.map(value => !value)),
                                TextInput(asRef(game.metadata.ulid), "ID")
                                    .setDisabled(blinking),
                                DateTimeInput(asRef(new Date(game.metadata.creationDate).toISOString().replace("Z", "")), "Creation Date")
                                    .setDisabled(),
                                DateTimeInput(asRef(new Date(game.metadata.lastModifiedDate).toISOString().replace("Z", "")), "Last Modified Date")
                                    .setDisabled(),
                                TextAreaInput(asRef(JSON.stringify(game.spec, null, 2)), "Spec")
                                    .setCssStyle("gridColumn", "span 2"),
                                TextAreaInput(asRef(JSON.stringify(game.spec, null, 2)))
                                    .setCssStyle("gridColumn", "span 2"),
                            )
                                .setGap("15px 10px")
                                .setEvenColumns(2),
                            Grid(
                                TextButton("Cancel")
                                    .onClick(() => sheets.removeOne()),
                                PrimaryButton("Save")
                                    .onPromiseClick(async () => {
                                        await delay(300).then(() => sheets.removeOne());
                                    })
                            )
                                .setGap()
                                .setAutoFlow("column")
                                .setJustifyContent("end")
                        )
                            .setGap()
                    );
                })
        )
            .setWidth("100%")
    )
        .useAltLayout()
);
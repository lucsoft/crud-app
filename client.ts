import { Label, Content, asRef, List, css, asWebGenComponent, LabelComponent, Reference, Refable, Box, Grid, HTMLComponent, Color, Component } from "../WebGen/core/mod.ts";
import { BootstrapIcon, PrimaryButton, SecondaryButton, TextButton, WebGenTheme, Entry } from "../WebGen/components/mod.ts";
import { createStableRequest } from "../WebGen/extended/mod.ts";
import { Game } from "./types.ts";
import { alwaysRef, listen, WriteSignal } from "../WebGen/core/state.ts";
import { MaterialIcon } from "../WebGen/components/icons.ts";
import { Spinner } from "../WebGen/components/spinner.ts";
import { delay } from "jsr:@std/async@0.224.2";
import { EmailInput, PasswordInput, TextInput } from "../WebGen/components/form/input.ts";

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

document.body.append(
    WebGenTheme(
        Content(
            Label("CRUD Demo - Game list")
                .setFontWeight("bold")
                .setTextSize("4xl")
                .setMargin("50px 0 10px"),
            Grid(
                PrimaryButton("Reload Game List")
                    .setDisabled(buttonDisabled)
                    .addPrefix(MaterialIcon("refresh"))
                    .onPromiseClick(() => fetchGameList())

            )
                .setGap()
                .setAutoFlow("column")
                .setAutoColumn("max-content")
                .setAlignContent("center")
                .setMargin("5px 0")
            ,
            Label(data),
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
            List(list, 90, (game) => (
                Entry(
                    Grid(
                        Label(game.metadata.name)
                            .setTextSize("xl")
                            .setFontWeight("bold"),
                        Label("A Game")
                            .setFontWeight("bold")
                    )
                        .setGap("5px")
                )
                    .onPromiseClick(async () => {
                        await delay(1000);
                    })
            ))
                .setGap(15)
        )
            .setWidth("100%")
    )
        .useAltLayout()
        .draw()
);
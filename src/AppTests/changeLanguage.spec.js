import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/vue";
import { test } from "vitest";

import App from "@/App.vue";
import i18n from "@/base/i18n";
import locales from "@/locales/index";
import router from "@/router";

import { withDefaults } from ">/helpers";
import { useMockBackend } from ">/mockBackend/setup";

useMockBackend();

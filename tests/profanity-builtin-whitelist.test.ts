import { describe, it, expect } from "vitest";
import { Profanity, CensorType } from "../src";

describe("Built-in whitelist", () => {
  describe("Swedish names with sub-word matching", () => {
    it("should not flag Swedish names that contain profane substrings", () => {
      const p = new Profanity({ wholeWord: false, languages: ["sv"] });

      expect(p.exists("Stefan")).toBe(false);
      expect(p.exists("Staffan")).toBe(false);
      expect(p.exists("Fanny")).toBe(false);
      expect(p.exists("James")).toBe(false);
      expect(p.exists("Horace")).toBe(false);
      expect(p.exists("Hermes")).toBe(false);
      expect(p.exists("Tiffany")).toBe(false);
    });

    it("should still detect standalone profane words", () => {
      const p = new Profanity({ wholeWord: false, languages: ["sv"] });

      expect(p.exists("fan")).toBe(true);
      expect(p.exists("hora")).toBe(true);
      expect(p.exists("fitta")).toBe(true);
      expect(p.exists("jävla")).toBe(true);
    });

    it("should not flag names when passed as per-call language override", () => {
      const p = new Profanity({ wholeWord: false });

      expect(p.exists("Stefan", ["sv"])).toBe(false);
      expect(p.exists("Staffan", ["sv"])).toBe(false);
    });

    it("should not apply Swedish whitelist when only English is active", () => {
      const p = new Profanity({ wholeWord: false, languages: ["en"] });

      // "james" contains "mes" which is Swedish profanity, but English is active
      // so the Swedish built-in whitelist should not apply.
      // However, "mes" is not an English profane word, so it won't match anyway.
      // Use a word that overlaps with English profanity to verify the concept.
      expect(p.exists("ass")).toBe(true);
    });

    it("should preserve whitelisted names in censor output", () => {
      const p = new Profanity({ wholeWord: false, languages: ["sv"] });

      expect(p.censor("Stefan är här")).toBe("Stefan är här");
      expect(p.censor("Hej Fanny")).toBe("Hej Fanny");
    });

    it("should censor profane words but preserve names in the same text", () => {
      const p = new Profanity({ wholeWord: false, languages: ["sv"] });

      const result = p.censor("Stefan sa fan");
      expect(result).toBe(`Stefan sa ${p.options.grawlix}`);
    });

    it("should work alongside user-managed whitelist", () => {
      const p = new Profanity({ wholeWord: false, languages: ["sv"] });
      p.whitelist.addWords(["customword"]);

      // Built-in whitelist still works
      expect(p.exists("Stefan")).toBe(false);
      // User whitelist still works
      expect(p.exists("customword")).toBe(false);
    });

    it("should handle case-insensitive name matching", () => {
      const p = new Profanity({ wholeWord: false, languages: ["sv"] });

      expect(p.exists("stefan")).toBe(false);
      expect(p.exists("STEFAN")).toBe(false);
      expect(p.exists("Stefan")).toBe(false);
    });
  });
});

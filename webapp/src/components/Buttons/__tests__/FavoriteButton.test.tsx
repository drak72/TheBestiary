import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FavoriteButton } from "@components/Buttons/FavoriteButton";
import { useLocalStorage } from "@hooks/useLocalStorage";

jest.mock("@hooks/useLocalStorage");

describe("FavoriteButton", () => {
    const mockUseLocalStorage = useLocalStorage as jest.Mock;

    beforeEach(() => {
        mockUseLocalStorage.mockReturnValue([[], jest.fn()]);
    });

    it("renders HeartOutline when entityId is not in favorites", () => {
        render(<FavoriteButton entityId="1" />);
        expect(screen.getByRole("button")).toContainElement(screen.getByTestId("HeartOutline"));
    });

    it("renders HeartSolid when entityId is in favorites", () => {
        mockUseLocalStorage.mockReturnValue([["1"], jest.fn()]);
        render(<FavoriteButton entityId="1" />);
        expect(screen.getByRole("button")).toContainElement(screen.getByTestId("HeartSolid"));
    });

    it("adds entityId to favorites when HeartOutline button is clicked", () => {
        const setData = jest.fn();
        mockUseLocalStorage.mockReturnValue([[], setData]);
        render(<FavoriteButton entityId="1" />);
        fireEvent.click(screen.getByRole("button"));
        expect(setData).toHaveBeenCalledWith(["1"]);
    });

    it("removes entityId from favorites when HeartSolid button is clicked", () => {
        const setData = jest.fn();
        mockUseLocalStorage.mockReturnValue([["1"], setData]);
        render(<FavoriteButton entityId="1" />);
        fireEvent.click(screen.getByRole("button"));
        expect(setData).toHaveBeenCalledWith([]);
    });
});
export function setBackground(imageUrl: string, colBlock: string): string {
  const backgroundImage = `
    <style>
      .${colBlock.replace(/ /g, ".")} {
      width: 100vw;
      margin: 0;
      padding: 0;
      background-image: url('${imageUrl}');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      }
    </style>`;
    return backgroundImage;
}

export function generateSectionContent(sectionName: string, bgImgURL: string, colBlockHTML: string): string {
  return `
    <section id="${sectionName}" style="background-image: url('${bgImgURL}'); background-size: cover; background-repeat: no-repeat; background-position: center; height: 100vh;">
      <div class="row about-features">
        <div>
          ${colBlockHTML}
        </div>
      </div>
    </section>`;
}
